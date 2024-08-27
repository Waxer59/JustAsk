# Just Ask

<img src="./docs/justAsk.webp" />

**Just Ask** is an interview simulation platform that uses real job offers. With **Just Ask**, you can search for an existing job offer or manually enter one yourself. You then have the option to attach relevant files, such as your resume or a SWOT analysis, to include in the simulation. The next step is to define the interview style: you can choose to simulate a full interview, where you'll be asked five questions, receive a performance score, and get detailed feedback on how to improve. Alternatively, you can skip this step and simply receive the questions. The choice is yours!

## How to run the project?

1. Install all the dependencies with the command:

```bash
pnpm i
```

2. Rename the file `.template.env` to `.env` and fill the fields.
   
   * `GROQ_API_KEY`: You will need a [Groq](https://console.groq.com/) API key.
   * `JSEARCH_API_KEY`: You will need a [Jsearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) API key. 
   * `RAPID_API_HOST`: Provide the Rapid API host.

3. Run the project with the command:

```bash
pnpm dev
```

## Technologies used

* [React](https://react.dev/)
* [Astro](https://astro.build/)
* [Shadcn](https://ui.shadcn.com/)
* [MagicUI](https://magicui.design/)
* [Vercel AI SDK](https://sdk.vercel.ai/)
* [Lucide Icons](https://lucide.dev/icons/)
* [Canvas confetti](https://github.com/catdad/canvas-confetti)
* [FilePond](https://pqina.nl/filepond/)
* [Zustand](https://zustand-demo.pmnd.rs/)

## API's used

* [Groq](https://console.groq.com/)
* [Jsearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
