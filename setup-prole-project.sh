#!/bin/bash

# Prole Summer Project Setup Script
# Built by workers, for workers

echo "🔧 Setting up your prole summer project..."
echo ""

# Get project details
echo "Let's get the basics:"
read -p "Project name: " PROJECT_NAME
read -p "Your GitHub username: " USERNAME
read -p "Brief description of what this does: " PROJECT_DESCRIPTION

# Optional details
echo ""
echo "Optional details (press enter to skip):"
read -p "Prerequisites (e.g., Node.js, Python): " PREREQUISITES
read -p "Installation steps: " INSTALLATION_STEPS
read -p "Usage example: " USAGE_EXAMPLE
read -p "Test commands: " TEST_COMMANDS
read -p "Dev requirements: " DEV_REQUIREMENTS
read -p "Dev setup steps: " DEV_SETUP_STEPS
read -p "License info: " LICENSE_INFO

echo ""
echo "🛠️  Setting up files..."

# Set defaults for empty values
PREREQUISITES=${PREREQUISITES:-"Nothing fancy"}
INSTALLATION_STEPS=${INSTALLATION_STEPS:-"# We'll add actual setup steps as we build this"}
USAGE_EXAMPLE=${USAGE_EXAMPLE:-"# It should be this easy\n${PROJECT_NAME,,} do-the-thing"}
TEST_COMMANDS=${TEST_COMMANDS:-"# Make sure your changes work\n# We'll add proper tests as the project grows"}
DEV_REQUIREMENTS=${DEV_REQUIREMENTS:-"Whatever language/runtime we end up using"}
DEV_SETUP_STEPS=${DEV_SETUP_STEPS:-"# We'll add actual setup steps as we build this"}
LICENSE_INFO=${LICENSE_INFO:-"Open source, as it should be. Details TBD, but expect something that keeps it free and open."}

# Create README from template
if [ -f "README-TEMPLATE.md" ]; then
    # macOS sed requires backup extension for -i flag
    sed "s/{{PROJECT_NAME}}/$PROJECT_NAME/g; 
         s/{{USERNAME}}/$USERNAME/g; 
         s/{{PROJECT_DESCRIPTION}}/$PROJECT_DESCRIPTION/g;
         s/{{PREREQUISITES}}/$PREREQUISITES/g;
         s|{{INSTALLATION_STEPS}}|$INSTALLATION_STEPS|g;
         s|{{USAGE_EXAMPLE}}|$USAGE_EXAMPLE|g;
         s/{{LICENSE_INFO}}/$LICENSE_INFO/g" README-TEMPLATE.md > README.md
         
    # Remove template instructions section (macOS compatible)
    sed -i '' '/^---$/,/^4\. Keep the prole summer spirit!$/d' README.md
    
    echo "✅ Created README.md"
fi

# Create CONTRIBUTING from template
if [ -f "CONTRIBUTING-TEMPLATE.md" ]; then
    sed "s/{{PROJECT_NAME}}/$PROJECT_NAME/g; 
         s/{{USERNAME}}/$USERNAME/g; 
         s/{{DEVELOPMENT_REQUIREMENTS}}/$DEV_REQUIREMENTS/g;
         s|{{DEVELOPMENT_SETUP_STEPS}}|$DEV_SETUP_STEPS|g;
         s|{{TEST_COMMANDS}}|$TEST_COMMANDS|g" CONTRIBUTING-TEMPLATE.md > CONTRIBUTING.md
         
    # Remove template instructions section (macOS compatible)
    sed -i '' '/^---$/,/^3\. Customize the development workflow/d' CONTRIBUTING.md
    
    echo "✅ Created CONTRIBUTING.md"
fi

# Update issue templates
if [ -d ".github/ISSUE_TEMPLATE" ]; then
    find .github/ISSUE_TEMPLATE -name "*.yml" -exec sed -i '' "s/USERNAME/$USERNAME/g; s/PROJECT_NAME/$PROJECT_NAME/g" {} \;
    echo "✅ Updated issue templates"
fi

# Clean up template files
read -p "Remove template files? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f README-TEMPLATE.md CONTRIBUTING-TEMPLATE.md
    echo "✅ Cleaned up template files"
fi

echo ""
echo "🎉 Your prole summer project is ready!"
echo ""
echo "Next steps:"
echo "1. Review and customize README.md and CONTRIBUTING.md"
echo "2. Start building something useful"
echo "3. Keep it simple and accessible"
echo ""
echo "Remember: built by workers, for workers. Keep it real!"
echo ""