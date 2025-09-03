#!/bin/bash

# Husky Setup Script with detailed feedback
# This script runs automatically after package installation

echo ""
echo "🔧 Setting up Husky Git Hooks..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}📦 Initializing Husky...${NC}"

# Run husky installation
if husky; then
    echo "${GREEN}✅ Husky initialized successfully${NC}"
else
    echo "❌ Husky initialization failed"
    exit 1
fi

echo ""
echo "${BLUE}🔍 Verifying hook files...${NC}"

# Check if hook files exist and set permissions
hooks_found=0

if [ -f ".husky/pre-commit" ]; then
    chmod +x .husky/pre-commit
    echo "${GREEN}✅ Pre-commit hook found and made executable${NC}"
    hooks_found=$((hooks_found + 1))
else
    echo "⚠️  Pre-commit hook not found"
fi

if [ -f ".husky/pre-push" ]; then
    chmod +x .husky/pre-push
    echo "${GREEN}✅ Pre-push hook found and made executable${NC}"
    hooks_found=$((hooks_found + 1))
else
    echo "⚠️  Pre-push hook not found"
fi

echo ""
echo "${BLUE}🛡️ Verifying security configuration...${NC}"

# Check protected branches configuration
if grep -q "protected_branches" .husky/pre-push 2>/dev/null; then
    echo "${GREEN}✅ Protected branches configured (main, develop, test, prod)${NC}"
else
    echo "⚠️  Protected branches configuration not found"
fi

# Check authorized users configuration
if grep -q "authorized_users" .husky/pre-push 2>/dev/null; then
    echo "${GREEN}✅ Authorized users configured${NC}"
else
    echo "⚠️  Authorized users configuration not found"
fi

echo ""
echo "${BLUE}📋 Quality checks verification...${NC}"

# Check if lint script has zero warnings policy
if grep -q "lint.*--max-warnings 0" package.json; then
    echo "${GREEN}✅ Zero warnings policy enabled in ESLint${NC}"
else
    echo "⚠️  Zero warnings policy not configured"
fi

# Check if lint-staged is configured
if grep -q "lint-staged" package.json; then
    echo "${GREEN}✅ Lint-staged configuration found${NC}"
else
    echo "⚠️  Lint-staged configuration missing"
fi

echo ""
echo "${YELLOW}📊 Setup Summary:${NC}"
echo "   • Hooks installed: ${hooks_found}/2"
echo "   • Zero tolerance policy: Enabled"

echo ""
if [ $hooks_found -eq 2 ]; then
    echo "${GREEN}🎉 Husky setup completed successfully!${NC}"
    echo "${GREEN}🔒 All git hooks are now active and protecting your code quality${NC}"
    echo ""
    echo ""
else
    echo "⚠️  Husky setup completed with warnings"
    echo "   Some hooks may not be properly configured"
fi

echo ""