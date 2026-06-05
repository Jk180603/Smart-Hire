from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os, json

load_dotenv()

# Groq LLM — free and fast
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

# Loads once, reused for all requests (~90MB download first time)
embedder = SentenceTransformer("all-MiniLM-L6-v2")


def analyse_jd(jd_text: str) -> dict:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a job description analyser.
Return ONLY valid JSON. No markdown, no explanation, just JSON."""),
        ("human", """Analyse this job description and return this exact JSON structure:
{{
  "required_skills": ["skill1", "skill2"],
  "nice_to_have": ["skill1", "skill2"],
  "experience_level": "junior",
  "key_technologies": ["tech1", "tech2"],
  "role_summary": "one sentence"
}}

Job Description:
{jd_text}""")
    ])

    chain = prompt | llm
    response = chain.invoke({"jd_text": jd_text})

    try:
        # Strip markdown code blocks if Groq adds them
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content.strip())
    except Exception as e:
        return {"error": str(e), "raw": response.content}


def compute_match_score(cv_text: str, jd_text: str) -> float:
    cv_emb  = embedder.encode([cv_text])
    jd_emb  = embedder.encode([jd_text])
    score   = cosine_similarity(cv_emb, jd_emb)[0][0]
    return round(float(score) * 100, 1)


def generate_feedback(cv_text: str, jd_text: str) -> str:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a career coach. Be concise and specific. Max 3 bullet points."),
        ("human", """Compare this CV and job description.
Return exactly 3 bullet points:
- What matches well
- What is missing
- One improvement tip

CV: {cv_text}

Job Description: {jd_text}""")
    ])
    chain = prompt | llm
    response = chain.invoke({"cv_text": cv_text, "jd_text": jd_text})
    return response.content