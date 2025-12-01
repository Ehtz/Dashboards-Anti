import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are a strategic business analyst AI. You have access to a dataset of businesses and their scores across 19 strategic matrices.
Your goal is to answer user questions about this data, identify patterns, outliers, and opportunities.

The matrices are:
- Financials: Net Margin, Gross Margin, Revenue Habit (ARPU), LTV
- Market: TAM, SAM, SOM, Unit Economics (LTV:CAC)
- Product: Engineering Culture, Advocacy Potential, Cognitive Economics, Product Market Fit, Sales Friction
- Operations: Operational Reliance, Tech Valuation, Mind Share, Cyborg Matrix, Output Leverage

When analyzing, look for correlations (e.g., high shipping speed + high quality = high performer).
Be insightful, concise, and strategic.
`;

export async function POST(req: Request) {
    try {
        const { businesses, query } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
    ${SYSTEM_PROMPT}

    Current Dashboard Data:
    ${JSON.stringify(businesses, null, 2)}

    User Question: ${query}
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ analysis: text });
    } catch (error) {
        console.error('Pattern analysis error:', error);
        return NextResponse.json({ error: 'Failed to analyze patterns' }, { status: 500 });
    }
}
