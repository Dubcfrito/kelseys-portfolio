#!/bin/bash

# Move into your animations folder
cd portfolio-materials/Animation || exit

# Create a thumbnails folder (optional, or save alongside videos)
mkdir -p thumbnails

# Loop through all .mp4 files
for video in *.mp4; do
  # Get the base filename without extension
  base_name="${video%.mp4}"
  
  # Generate a thumbnail at 1 second into the video
  ffmpeg -ss 00:00:01 -i "$video" -vframes 1 -q:v 2 "${base_name}.jpg"
  
  echo "Generated thumbnail for $video"
done
