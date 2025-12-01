import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are a strategic business analyst AI. Your task is to analyze a business description and score it on 19 specific matrices.
For each matrix, provide a score from 0 to 100 based on the description and your general knowledge of similar business models.

The 19 matrices and their keys are:
1. Net Margin Profile (netMargin): 0=Cash Burner, 100=Cash Cow
2. Gross Margin Profile (grossMargin): 0=Commodity, 100=SaaS Unicorn
3. Revenue Habit (arpu): 0=Low Value, 100=Recurring Enterprise (Note: this maps to ARPU in the matrix, but think of it as Revenue Quality/Habit)
4. Long Term Value (ltv): 0=Churn Factory, 100=Compounder
5. TAM Economics (tam): 0=Niche Hobby, 100=Platform Giant
6. SAM Economics (sam): 0=Local Player, 100=Market Leader
7. SOM Economics (som): 0=Struggling, 100=Monopoly
8. Unit Economics (cac): 0=The Graveyard (High CAC), 100=Enterprise Scale (Efficient CAC)
9. Engineering Culture (shippingSpeed): 0=Doomed, 100=High Performer
10. Quality/Stability (quality): 0=Legacy Bank, 100=High Performer
11. Advocacy Potential (shareOpp): 0=Secret Tool, 100=Social/Viral
12. Cognitive Economics (cognitiveLoad): 0=Cheap & Simple, 100=Invisible Tech (Low load is good, but high score here means "Invisible Tech" which usually implies low friction. Wait, let's stick to the axis: 0=Low Load, 100=High Load? No, check the matrix: LowLow=Cheap&Simple, HighHigh=Invisible Tech. Actually, let's assume 0-100 maps to the X-axis "Cognitive Load". 0=Low Load, 100=High Load. 
   - WAIT: The matrix says X-axis: Cognitive Load. Low=Cheap, High=Consumer App?
   - Let's look at the labels: LowLow=Cheap&Simple, LowHigh=Enterprise Complex. HighLow=Consumer App, HighHigh=Invisible Tech.
   - Actually, just score "cognitiveLoad" from 0 (Simple) to 100 (Complex).
13. Product Market Fit (marketSize): 0=Pivot Needed, 100=Scale Ready (Maps to Market Size Potential)
14. CSAT / Retention (csat): 0=Pivot Needed, 100=Scale Ready
15. Sales Friction (clarity): 0=Consultative, 100=PLG (Value Prop Clarity)
16. No Brainer Score (buyability): 0=Consultative, 100=PLG
17. Operational Reliance (control): 0=Platform Dependent, 100=Sovereign
18. Operational Risk (risk): 0=Platform Dependent, 100=Sovereign
19. Tech Valuation (complexity): 0=Wrapper, 100=Moat
20. Mind Share (mindShare): 0=Forgotten, 100=Top of Mind
21. Cyborg Matrix (humanInput): 0=Legacy Tool, 100=Co-Pilot (Human Input Freq)
22. AI Autonomy (aiAutonomy): 0=Legacy Tool, 100=Co-Pilot
23. Output Leverage (timeInput): 0=Slog, 100=Software Scale
24. Output ($) (output): 0=Slog, 100=Software Scale

Wait, I need to match the exact keys expected by the frontend:
frequency, netMargin, grossMargin, arpu, ltv, tam, sam, som, cac, shippingSpeed, quality, shareOpp, cognitiveLoad, marketSize, csat, clarity, buyability, control, risk, complexity, mindShare, humanInput, aiAutonomy, timeInput, output.

Return a JSON object with a "scores" key containing these integer values (0-100).
`;

export async function POST(req: Request) {
    try {
        const { description } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nBusiness Description:\n' + description }] }],
            generationConfig: {
                responseMimeType: 'application/json',
            }
        });

        const response = result.response;
        const text = response.text();
        const data = JSON.parse(text);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json({ error: 'Failed to analyze business' }, { status: 500 });
    }
}
