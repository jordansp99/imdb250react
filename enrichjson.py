import json
import csv
import os
import datetime

def enrich_json_with_csv(json_file, csv_file):
    """
    Reads JSON data (one object per line), enriches it with year and rating from a CSV,
    and prints the enriched JSON objects while creating a backup JSON.

    Args:
        json_file (str): Path to the JSON file.
        csv_file (str): Path to the CSV file.
    """

    film_data = {}
    with open(csv_file, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            film_name = row['Film Name']
            film_data[film_name] = {'Year': row['Year'], 'Rating': row['Rating']}

    # Create a backup JSON filename based on the current time
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_json_file = f"{os.path.splitext(json_file)[0]}_backup_{timestamp}.json"
    
    with open(json_file, 'r', encoding='utf-8') as jsonfile, \
         open(backup_json_file, 'w', encoding='utf-8') as backup_file:
         
        for line in jsonfile:
            try:
                json_obj = json.loads(line)
                film_name = json_obj.get("Film Name")

                if film_name and film_name in film_data:
                  json_obj['Year'] = film_data[film_name]['Year']
                  json_obj['Rating'] = film_data[film_name]['Rating']
                
                backup_file.write(json.dumps(json_obj) + '\n') # Write to the backup json

                print(json.dumps(json_obj))  # Output the original or updated json
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e} - line: {line.strip()}")
                backup_file.write(line) # Write the line to backup if json decoding fails


    print(f"Backup JSON file created: {backup_json_file}")

if __name__ == "__main__":
    json_file = "clues.jsonl"  # Replace with your JSON file path
    csv_file = "imdb_top_250.csv"  # Replace with your CSV file path
    enrich_json_with_csv(json_file, csv_file)