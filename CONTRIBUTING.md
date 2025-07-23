# Contributing to Twinning

*AI-Human Collaboration Platform - Built by workers, for workers*

Thanks for wanting to help build something that empowers human agency in the AI era! Twinning is a privacy-first, self-hosted AI infrastructure platform that puts data sovereignty and ethical AI at the center. We're regular people building professional-grade tools that actually matter for human autonomy.

## Ground Rules

Simple: don't be a jerk, and respect our core principles. Full details in our [Code of Conduct](CODE_OF_CONDUCT.md), but the gist is treat people like human beings, not code-producing machines.

**Core Principles:**
- **Data Sovereignty**: Your data stays under your control
- **Human Agency**: AI amplifies humans, never replaces human choice
- **Ethical AI**: All AI operations use the SPELWork ethical framework
- **Privacy First**: No unnecessary external dependencies or data sharing
- **Professional Quality**: Built for real production use, not just experiments

## How to Jump In

### Found a Bug?

Don't overthink it:
- Check if someone else already reported it
- If not, tell us what broke and how
- Include what you were trying to do
- Screenshots help if it's visual

No fancy templates required - just be clear about what's wrong.

### Got an Idea?

Great! Tell us:
- What problem would this solve?
- Who would use it?
- Why is this worth building?
- How does it align with our data sovereignty and ethical AI principles?

We're building for real users with real problems, not feature creep. Ideas should strengthen human agency and data control.

### Want to Code?

Here's the deal:

1. **Fork it**
   ```bash
   git clone https://github.com/[username]/twining.git
   cd twining
   ```

2. **Make a branch**
   ```bash
   git checkout -b fix-the-thing
   ```

3. **Do the work**
   - Keep it simple and readable
   - Don't break existing stuff
   - Test your changes (even if it's just "does it work?")
   - Write a decent commit message

4. **Send it back**
   - Open a pull request
   - Explain what you changed and why
   - Be ready to chat about it

No corporate code review process - we'll work it out together.

## Development Setup

We're keeping this simple. No 47-step setup process.

### What You Need

- A computer that can run code (preferably macOS for full MCP integration)
- Git (probably already have it)
- Docker and Docker Compose for local development
- Basic command line skills
- Node.js (for Intelligence service) or Python (for Memory/Social services)
- Understanding of our ethical AI principles (SPELWork framework)

### Getting Started

```bash
# Grab the code
git clone your-fork
cd twinning

# Quick start with Docker
docker-compose up

# Or run individual services
cd services/intelligence && npm install && npm run dev
cd services/memory && pip install -r requirements.txt && python memory_api.py
cd services/social && pip install -r requirements.txt && python social_automation_api.py

# Check health of all services
curl http://localhost:3000/health  # Core
curl http://localhost:3002/health  # Intelligence 
curl http://localhost:3003/health  # Memory
curl http://localhost:8080/health  # Social
```

### Testing

```bash
# Make sure your changes work
# We'll add proper tests as the project grows
```

## Keep It Simple

### Writing Code

- **Readable over clever** - Your future self will thank you
- **Simple over complex** - If you need a PhD to understand it, rewrite it
- **Working over perfect** - Ship something useful, then make it better
- **Comments for the why** - The code shows what, comments explain why
- **Ethical by design** - All AI operations must use the SPELWork framework
- **Privacy preserving** - No unnecessary external API calls or data sharing
- **Performance matters** - We maintain real benchmarks (64.3 contacts/sec, etc.)

### Commit Messages

Just be clear:
- "Fix the login bug" ✓
- "refactor user authentication subsystem architecture" ✗
- "Add search to the dashboard" ✓
- "implement polymorphic query optimization" ✗

### Documentation

- If you change how something works, update the docs
- If you add something new, explain how to use it
- If it's confusing, add a comment

## How We Review

No bureaucracy, just common sense:

1. **Someone else looks at your code** - Fresh eyes catch bugs
2. **We talk about it** - Questions, suggestions, improvements
3. **You fix anything needed** - Work together to make it good
4. **Ship it** - Get useful code to users

Remember: we're all doing this in our spare time, so be patient and be kind.

## Community Vibes

- **Help newcomers** - We were all beginners once
- **Share knowledge** - Teach what you know, learn what you don't
- **Stay practical** - Focus on building useful stuff that empowers people
- **Keep it real** - No pretentious tech bro nonsense or AI hype
- **Respect privacy** - Never ask for or share personal data unnecessarily
- **Human-centered** - AI should amplify human capabilities, not replace humans

## Need Help?

- **Stuck on something?** Open an issue and ask
- **Not sure how to contribute?** Just start somewhere small
- **Want to chat?** Use discussions or issues
- **Found a typo?** Fix it and send a PR

We're all figuring this out together.

## Props

Everyone who helps gets credit. We'll keep track in:
- README contributors section
- Release notes when we ship stuff
- General appreciation for making useful things

## Legal Stuff

By contributing, you're agreeing your code can be used under whatever open license we pick. Nothing sneaky, just keeping things free and open.

---

**Twinning** - AI-Human Collaboration with Data Sovereignty

Thanks for helping build something that truly empowers human agency in the AI era!
