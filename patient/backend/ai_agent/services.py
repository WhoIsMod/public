import os
import json
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

class LlamaMedicalInterpreter:
    def __init__(self):
        self.model_name = "meta-llama/Llama-2-7b-chat-hf"
        if TRANSFORMERS_AVAILABLE:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = "cpu"
        self.tokenizer = None
        self.model = None
        self._load_model()
    
    def _load_model(self):
        if not TRANSFORMERS_AVAILABLE:
            self.tokenizer = None
            self.model = None
            return
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None
            )
            if self.device == "cpu":
                self.model = self.model.to(self.device)
        except Exception as e:
            print(f"Error loading model: {e}")
            self.tokenizer = None
            self.model = None
    
    def interpret_document(self, text):
        if not self.model or not self.tokenizer:
            return self._fallback_interpretation(text)
        
        prompt = f"""You are a medical document interpreter. Analyze the following medical document and provide:
1. A clear summary in plain language
2. Key findings
3. Recommendations

Medical Document:
{text}

Provide your interpretation:"""
        
        try:
            inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=512,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9
                )
            
            interpreted_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            summary = self._extract_summary(interpreted_text)
            key_findings = self._extract_findings(interpreted_text)
            recommendations = self._extract_recommendations(interpreted_text)
            
            return {
                'interpreted_text': interpreted_text,
                'summary': summary,
                'key_findings': key_findings,
                'recommendations': recommendations,
                'confidence_score': 0.85
            }
        except Exception as e:
            print(f"Error during interpretation: {e}")
            return self._fallback_interpretation(text)
    
    def _fallback_interpretation(self, text):
        words = text.split()
        summary = f"This medical document contains {len(words)} words. Please consult with a healthcare professional for detailed interpretation."
        return {
            'interpreted_text': text,
            'summary': summary,
            'key_findings': [],
            'recommendations': ['Consult with your healthcare provider for detailed analysis'],
            'confidence_score': 0.5
        }
    
    def _extract_summary(self, text):
        if "summary" in text.lower():
            lines = text.split('\n')
            for i, line in enumerate(lines):
                if "summary" in line.lower():
                    return lines[i+1] if i+1 < len(lines) else text[:200]
        return text[:200]
    
    def _extract_findings(self, text):
        findings = []
        keywords = ['finding', 'result', 'diagnosis', 'condition', 'abnormal']
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in keywords):
                findings.append(line.strip())
        return findings[:5]
    
    def _extract_recommendations(self, text):
        recommendations = []
        keywords = ['recommend', 'suggest', 'advise', 'should', 'must']
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in keywords):
                recommendations.append(line.strip())
        return recommendations[:5]

interpreter = LlamaMedicalInterpreter()
