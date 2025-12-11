#!/bin/bash

echo "🎬 Starting thumbnail generation for all video folders..."
echo ""

# Array of folders containing videos
video_folders=(
  "portfolio-materials/Animation"
  "portfolio-materials/Videos"
  "portfolio-materials/Demo_Reel"
)

# Function to generate thumbnails for a folder
generate_thumbnails() {
  local folder=$1
  
  # Check if folder exists
  if [ ! -d "$folder" ]; then
    echo "⚠️  Folder not found: $folder - skipping"
    echo ""
    return
  fi
  
  echo "📁 Processing folder: $folder"
  
  # Move into the folder
  cd "$folder" || return
  
  # Count videos to process
  video_count=$(ls -1 *.mp4 2>/dev/null | wc -l)
  
  if [ "$video_count" -eq 0 ]; then
    echo "   No .mp4 files found in this folder"
    cd - > /dev/null || exit
    echo ""
    return
  fi
  
  echo "   Found $video_count video(s) to process"
  
  # Counter for progress
  current=0
  
  # Loop through all .mp4 files
  for video in *.mp4; do
    # Skip if no mp4 files exist (handles the *.mp4 literal case)
    [ -f "$video" ] || continue
    
    current=$((current + 1))
    
    # Get the base filename without extension
    base_name="${video%.mp4}"
    
    # Check if thumbnail already exists
    if [ -f "${base_name}.jpg" ]; then
      echo "   [$current/$video_count] ⏭️  Thumbnail already exists for $video"
      continue
    fi
    
    # Generate a thumbnail at 1 second into the video
    # -ss: seek to timestamp
    # -i: input file
    # -vframes 1: extract 1 frame
    # -q:v 2: high quality (2-5 is good, lower is better)
    ffmpeg -ss 00:00:01 -i "$video" -vframes 1 -q:v 2 "${base_name}.jpg" -y 2>/dev/null
    
    if [ $? -eq 0 ]; then
      echo "   [$current/$video_count] ✅ Generated thumbnail for $video"
    else
      echo "   [$current/$video_count] ❌ Failed to generate thumbnail for $video"
    fi
  done
  
  # Go back to original directory
  cd - > /dev/null || exit
  echo ""
}

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
  echo "❌ Error: ffmpeg is not installed"
  echo "Please install ffmpeg first:"
  echo "  - Mac: brew install ffmpeg"
  echo "  - Ubuntu/Debian: sudo apt-get install ffmpeg"
  echo "  - Windows: Download from https://ffmpeg.org/download.html"
  exit 1
fi

# Process each folder
for folder in "${video_folders[@]}"; do
  generate_thumbnails "$folder"
done

echo "✨ Thumbnail generation complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run 'node generate-json.js' or 'python generate-json.py' to update JSON files"
echo "   2. Refresh your website to see the changes"