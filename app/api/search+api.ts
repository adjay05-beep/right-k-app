export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const display = searchParams.get('display') || '5';
    const sort = searchParams.get('sort') || 'random';

    if (!query) {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), { status: 400 });
    }

    console.log(`[Proxy] Searching for: ${query}`);

    const NAVER_CLIENT_ID = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET;

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        console.error('[Proxy] Naver API credentials are missing!');
        console.error(`[Proxy] CLIENT_ID: ${NAVER_CLIENT_ID ? 'SET' : 'MISSING'}`);
        console.error(`[Proxy] CLIENT_SECRET: ${NAVER_CLIENT_SECRET ? 'SET' : 'MISSING'}`);
        return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    console.log(`[Proxy] API keys loaded: ID=${NAVER_CLIENT_ID?.substring(0, 4)}***, SECRET=${NAVER_CLIENT_SECRET?.substring(0, 2)}***`);

    try {
        const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=${display}&start=1&sort=${sort}`;

        console.log(`[Proxy] Calling Naver API: ${apiUrl.substring(0, 80)}...`);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        });

        if (!response.ok) {
            console.error('[Proxy] Naver API Error:', response.status, response.statusText);
            return Response.json({ error: 'Failed to fetch from Naver API' }, { status: response.status });
        }

        const data = await response.json();
        console.log(`[Proxy] Naver API returned ${data.items?.length || 0} items`);
        if (data.items && data.items.length > 0) {
            console.log(`[Proxy] First result: ${data.items[0].title}`);
        }

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('[Proxy] Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
