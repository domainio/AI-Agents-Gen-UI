#!/bin/bash

echo "🧪 Testing AG-UI Backend with curl..."

# Generate UUIDs (simple version for demo)
THREAD_ID=$(uuidgen)
RUN_ID=$(uuidgen)
MESSAGE_ID=$(uuidgen)

echo "📤 Sending request to http://localhost:8000/awp"

curl -X POST http://localhost:8000/awp \
  -H "Content-Type: application/json" \
  -d "{
    \"threadId\": \"$THREAD_ID\",
    \"runId\": \"$RUN_ID\",
    \"messages\": [
      {
        \"id\": \"$MESSAGE_ID\",
        \"role\": \"user\",
        \"content\": \"what did i asked you before?\"
      }
    ],
    \"tools\": [],
    \"context\": []
  }" \
  --no-buffer

echo -e "\n\n✅ Test completed!" 