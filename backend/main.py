# %%
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import UnstructuredPDFLoader

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore

from langchain_core.tools import tool

from langgraph.graph import MessagesState, StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain import hub
from langchain_core.messages import SystemMessage

from IPython.display import Image, display

llm = ChatOllama(
    model = "PetrosStav/gemma3-tools:4b",
    temperature = 0.2,
    num_predict =  256
)

# Define your fixed system prompt globally
SYSTEM_PROMPT = (
    "You are POG - a Personal Document Assistant. Your goal is to help users extract and find information from their own uploaded documents. You specialize in processing personal documents like ID cards, forms, certificates, bills, statements, and other official documents. Key rules:\n"
    "1. YOUR NAME IS ALWAYS 'POG'\n"
    "2. You MUST call retrieve tool for EVERY question\n"
    "3. You MUST NEVER invent answers - use only documents\n"
    "4. If you find the requested information, Respond: 'I found in your documents: [content]'"
    "5. If you cannot find the information, Respond: 'I could not find the requested information in your documents.'\n"
    "6. Keep your responses concise and focused on the user's query.\n"
    "7. Don't include all the retrieved content or metadata in your response, only the information that is specifically requested by the user.\n"
    "8. I\n"
)
# file_paths = [
#     "./documents/EPIC.pdf",    
# ]

file_path = "./documents/EPIC.pdf"
embeddings = OllamaEmbeddings(
    model="nomic-embed-text",
)
vector_store = InMemoryVectorStore(embeddings)

try:
    loader = UnstructuredPDFLoader(file_path, mode="single")
except Exception as e:
    print(f"UnstructuredLoader failed: {e}")
    # Fallback to PyPDFLoader if UnstructuredLoader fails
loader = PyPDFLoader(
    file_path,
    mode="single",
    extraction_mode="plain"
)

docs = loader.load()
# Print first 500 characters of the first document   

# %%
# For documents like ID cards, smaller chunks work better
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # Smaller chunks for better precision
    chunk_overlap=200,
)
all_splits = text_splitter.split_documents(docs)

_ = vector_store.add_documents(documents=all_splits)
prompt = hub.pull("rlm/rag-prompt")
@tool(response_format="content_and_artifact")
def retrieve(query: str):
    """Retrieve information related to a query."""
    retrieved_docs = vector_store.similarity_search(query, k=3)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\n" f"Content: {doc.page_content}")
        for doc in retrieved_docs
    )
    return serialized, retrieved_docs

# Step 2: Execute the retrieval.
tools = ToolNode([retrieve])


def query_or_respond(state: MessagesState):
    """Generate tool call for retrieval or respond."""
        # Inject system prompt here
    messages_with_system = [
        SystemMessage(content=SYSTEM_PROMPT),
        *state["messages"]
    ]
    llm_with_tools = llm.bind_tools([retrieve])
    response = llm_with_tools.invoke(messages_with_system)
    # MessagesState appends messages to state instead of overwriting
    return {"messages": [response]}

def generate(state: MessagesState):
    """Generate a response based on retrieved documents (text or OCR from images)."""
    recent_tool_messages = []
    for message in reversed(state["messages"]):
        if message.type == "tool":
            recent_tool_messages.append(message)
        else:
            break
    tool_messages = recent_tool_messages[::-1]
    docs_content = "\n\n".join(doc.content for doc in tool_messages)

    # Relevant, role-specific system prompt
    system_prompt = (  # SIMPLIFIED PROMPT
        SYSTEM_PROMPT + "\n\nRetrieved content:\n" + docs_content
    )


    conversation_messages = [
        message
        for message in state["messages"]
        if message.type in ("human", "system")
        or (message.type == "ai" and not message.type == "tool")
    ]

    prompt = [SystemMessage(content=system_prompt)] + conversation_messages

    response = llm.invoke(prompt)  # Uses the main bound ChatOllama model
    return {"messages": [response]}
    
    
# Compile application and test
graph_builder = StateGraph(MessagesState)

graph_builder.add_node(query_or_respond)
graph_builder.add_node(tools)
graph_builder.add_node(generate)

graph_builder.set_entry_point("query_or_respond")
graph_builder.add_conditional_edges(
    "query_or_respond",
    tools_condition,
    {END: END, "tools": "tools"},
)
graph_builder.add_edge("tools", "generate")
graph_builder.add_edge("generate", END)

graph = graph_builder.compile()

display(Image(graph.get_graph().draw_mermaid_png()))

# %%
input_message = "What is my phone number?"


for step in graph.stream(
    {"messages": [{"role": "user", "content": input_message}]},
    stream_mode="values",
):
    last_message = step["messages"][-1]
    # Only print non-tool messages
    if last_message.type != "tool":
        last_message.pretty_print()


# %%
