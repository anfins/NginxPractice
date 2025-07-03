import ollama
import sys
import json
def generate_response(user_input):
    response = ollama.chat(
        model="gemma3:1b",
        messages=[{"role": "user", "content": user_input}],
    )
    print(json.dumps(response["message"]["content"]))



if __name__ == "__main__":
    if len(sys.argv) > 1:
        
        userInput = sys.argv[1]
        generate_response(userInput)

