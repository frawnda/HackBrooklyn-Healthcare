# Ensure required packages are installed in the notebook environment
import os
import shutil
import ssl
from doctr.models import ocr_predictor
from doctr.io import DocumentFile
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain_classic.chains import RetrievalQA
from langchain_classic.prompts import PromptTemplate
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# class with necessary functions to be referred to from jsx files
class MedicalBillAnalyzer:
    def __init__(self):
        # Configuration
        self.DB_DIR = "./chroma_db"
        self.PDF_DATA_DIR = "./reference-health-files"
        
        # Initialize Models once to keep them in memory
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = Ollama(model="llama3.2", temperature=0, num_ctx=4096)
        self.ocr_model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn', pretrained=True)
        
        # Setup SSL for model downloads
        ssl._create_default_https_context = ssl._create_unverified_context

    # creates database with ./reference-health-files
    def build_knowledge_base(self):
        """Builds or refreshes the vector database."""
        if not os.path.exists(self.PDF_DATA_DIR):
            os.makedirs(self.PDF_DATA_DIR)
            return False

        loader = DirectoryLoader(self.PDF_DATA_DIR, glob="./*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
        chunks = text_splitter.split_documents(documents)
        
        if os.path.exists(self.DB_DIR):
            shutil.rmtree(self.DB_DIR)
            
        Chroma.from_documents(
            documents=chunks, 
            embedding=self.embeddings, 
            persist_directory=self.DB_DIR
        )
        return True
    
    # input images, output text
    def extract_text(self, image_paths):  # image_paths is an array of JPGs i.e. ["image1.jpg", "image2.jpg"]
        """OCR logic extracted from your notebook."""
        combined_text = ""
        for idx, img_path in enumerate(image_paths):
            if not os.path.exists(img_path): continue
            
            doc = DocumentFile.from_images([img_path])
            result = self.ocr_model(doc)
            combined_text += f"\n--- START OF PAGE {idx + 1} ---\n"
            
            for page in result.pages:
                for block in page.blocks:
                    for line in block.lines:
                        line_text = " ".join([word.value for word in line.words])
                        combined_text += line_text + "\n"
        return combined_text

    # create a detailed analysis of processed text, return summary
    def analyze(self, bill_text, target_language):
        """RAG logic with your specific constraints and language support."""
        vector_db = Chroma(persist_directory=self.DB_DIR, embedding_function=self.embeddings)
        
        template = """
        ### SYSTEM INSTRUCTION ###
        You are a Medical Billing Specialist, but don't state this at the beginning of the response. 
        CRITICAL: You will perform this task in {language}.

        ### CONSTRAINTS ###
        1. DIRECT ADDRESS: Speak directly to the user (e.g., use "You" in English,"Usted" or "Tu" in Spanish, "Vous" in French). 
        Do NOT refer to the user as "el paciente" or "le patient" in the third person.
        2. NO SIGN-OFFS: Do NOT include greetings, signatures, or placeholders like "[Votre nom]" or "Cordialement". 
        Start the analysis immediately.
        3. NO CHATBOT BEHAVIOR: Do not say "Here is your report" or "I hope this helps." 
        3. Be as simple, but straight to the point as possible. Be polite as well.
        4. Do not end with a question. Do not prompt the user to ask more questions.


        TASK:
        Compare the Statement to the EOB belonging to the user. Use the provided context to analyze the bills.
        Be factual, but also speak with less medical jargon and easier words.
        
        Additionally, make a recommendation based on context and current state of the bill of what steps a patient should take
        for financing their bill or if they should consider specific insurance coverage options.
        
        If the info isn't in the context, say you aren't sure.
        
        IMPORTANT:
        Be as simple, but straight to the point as possible. Be polite as well.
        Remember that you are addressing the user DIRECTLY. Do not say "the patient" or don't say the patient's name when summarizing.

        ### RESEARCH CONTEXT ###
        {context}

        ### PATIENT BILL ###
        {question}

        ### ANALYSIS REPORT ###
        """
        
        PROMPT = PromptTemplate(
            template=template, 
            input_variables=["context", "question"],
            partial_variables={"language": target_language} 
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=vector_db.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": PROMPT},
            input_key="question"
        )
        
        response = qa_chain.invoke({"question": bill_text})
        return response["result"]