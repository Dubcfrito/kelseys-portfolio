import os
import json

"""
Automatically generates JSON index files for portfolio folders
Run this script from your project root: python generate-json.py
"""

folders = [
    {
        'path': 'portfolio-materials/Animation',
        'output_file': 'animations.json',
        'extensions': ['.mp4', '.webm', '.mov']
    },
    {
        'path': 'portfolio-materials/Storyboarding',
        'output_file': 'images.json',
        'extensions': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    {
        'path': 'portfolio-materials/Videos',
        'output_file': 'videos.json',
        'extensions': ['.mp4', '.webm', '.mov']
    },
    {
        'path': 'portfolio-materials/Concept_Art',
        'output_file': 'images.json',
        'extensions': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    {
        'path': 'portfolio-materials/Fine_Art/Digital_Artwork',
        'output_file': 'images.json',
        'extensions': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    {
        'path': 'portfolio-materials/Fine_Art/Fundamentals',
        'output_file': 'images.json',
        'extensions': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    }
]

def generate_json(folder_config):
    folder_path = folder_config['path']
    output_file = folder_config['output_file']
    extensions = folder_config['extensions']
    
    # Check if folder exists
    if not os.path.exists(folder_path):
        print(f"⚠️  Folder not found: {folder_path} - skipping")
        return
    
    try:
        # Read all files in the directory
        files = os.listdir(folder_path)
        
        # Filter files by extensions and exclude JSON files
        filtered_files = [
            f for f in files 
            if os.path.splitext(f)[1].lower() in extensions 
            and f != output_file
        ]
        
        # Sort files alphabetically
        filtered_files.sort()
        
        # Write JSON file
        output_path = os.path.join(folder_path, output_file)
        with open(output_path, 'w') as json_file:
            json.dump(filtered_files, json_file, indent=2)
        
        print(f"✅ Generated {output_path} with {len(filtered_files)} files")
        
    except Exception as error:
        print(f"❌ Error processing {folder_path}: {str(error)}")

# Generate JSON for all folders
print("🚀 Starting JSON generation...\n")

for folder in folders:
    generate_json(folder)

print("\n✨ JSON generation complete!")
print("\n📝 Note: Make sure your video files have matching .jpg poster images")
print("   Example: video1.mp4 should have video1.jpg in the same folder")