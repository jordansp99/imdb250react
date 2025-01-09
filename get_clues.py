import csv
import google.generativeai as genai
import json
import os
import re
import time
import random

# Replace with your actual Gemini API key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Error: GOOGLE_API_KEY environment variable not set.")
    exit()
genai.configure(api_key=GOOGLE_API_KEY)

# Select the Gemini model
model = genai.GenerativeModel('gemini-2.0-flash-exp')

MAX_RETRIES = 3
RETRY_DELAY = 5

def generate_cryptic_clues(film_name):
    """Generates 5 cryptic clues for a given film name using Gemini API with retry logic.

    Args:
        film_name: The name of the film.

    Returns:
        A list of 5 cryptic clues as strings, or None if there's an error after max retries.
    """
    prompt = f"""Give me 5 very cryptic clues for the movie '{film_name}'. 
         Each clue should be short and intriguing, making it extremely cryptic and challenging.
         for someone familiar with the film. Don't include any character or actor names. Please provide the clues as a JSON array of strings in the following format:
          [
        "Clue 1",
        "Clue 2",
        "Clue 3",
        "Clue 4",
        "Clue 5"
            ]
            """
    retries = 0
    while retries < MAX_RETRIES:
        try:
            response = model.generate_content(prompt)
            # Attempt to parse the JSON from the response
            try:
                # Remove ```json and ``` if they exist in the response.
                text_to_parse = re.sub(r'```(json)?', '', response.text).strip()
                clues_json = json.loads(text_to_parse)
                if isinstance(clues_json, list) and len(clues_json) == 5 and all(isinstance(clue, str) for clue in clues_json):
                    return clues_json
                else:
                    print(f"Warning: Gemini API returned unexpected JSON format for '{film_name}'. Response: {response.text}")
                    return None
            except json.JSONDecodeError:
              print(f"Warning: Gemini API returned non-JSON response for '{film_name}'. Response: {response.text}")
              return None
        except Exception as e:
            print(f"Error generating clues for '{film_name}': {e}, retrying {retries}/{MAX_RETRIES}")
            retries +=1
            time.sleep(RETRY_DELAY)
    print(f"Error: Exceeded max retries for {film_name}")
    return None

def main():
    """Reads the CSV, generates cryptic clues for each film, and prints the output in JSON format."""
    processed_films = set()  # Keep track of processed films
    output_file = 'clues.jsonl'

    # Load previously generated clues, if any
    if os.path.exists(output_file):
      with open(output_file, 'r') as f:
        for line in f:
            try:
                film_data = json.loads(line)
                processed_films.add(film_data['Film Name'])
            except json.JSONDecodeError:
                print(f"Warning: Could not load json from file: {line}")

    with open('imdb_top_250.csv', 'r', newline='') as csvfile, open(output_file, 'a') as outputfile:
        reader = csv.DictReader(csvfile)
        films_to_process = list(reader) # Convert to list to facilitate retrying
        
        i = 0
        while i < len(films_to_process):
          row = films_to_process[i]
          film_name = row['Film Name']

          if film_name in processed_films:
              print(f"Skipping {film_name} as clues already exist in output.jsonl")
              i += 1
              continue  # Skip if clues already exist

          clues = generate_cryptic_clues(film_name)
          if clues:
              film_data = {
                  "Film Name": film_name,
                  "Clues": clues
              }
              json_line = json.dumps(film_data)
              print(json_line)
              outputfile.write(json_line + '\n')
              processed_films.add(film_name)  # Add to processed list
              i +=1

          else: # Retry logic will be handld by the function so this just needs to be printed.
                print(f"Failed to generate clues for '{film_name}' after multiple retries. Will try later")
                time.sleep(RETRY_DELAY) #Sleep before trying again
          
          #Add sleep so we don't over load the API
          sleep_duration = random.uniform(1, 2)  # Sleep between 1 and 2 seconds.
          print(f"Sleeping for {sleep_duration:.2f} seconds")
          time.sleep(sleep_duration)

if __name__ == "__main__":
    main()