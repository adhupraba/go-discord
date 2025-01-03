#!/bin/sh

# Array of environment variables to replace
ENV_VARS="
NEXT_PUBLIC_WS_URL
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
NEXT_PUBLIC_LIVEKIT_URL
"

sed_script=$(mktemp)

# Build the sed script
for VAR in $ENV_VARS; do
  VALUE=$(eval echo \$$VAR)
  if [ -n "$VALUE" ]; then
    printf "s|__%s__|%s|g\n" "$VAR" "$VALUE" >> "$sed_script"
    printf "Replacing __%s__ with %s\n" "$VAR" "$VALUE"
  else
    printf "Warning: %s is not set. Placeholder __%s__ will not be replaced.\n" "$VAR" "$VAR" >&2
  fi
done

# Perform replacements in all files in the .next directory
if [ -s "$sed_script" ]; then
  find ./.next -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" \) -exec sed -i -f "$sed_script" {} +
fi

# Clean up
rm -f "$sed_script"

# Start the application
exec "$@"
