import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set');
}

function validateCredentials(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  try {
    const base64Credentials = authHeader.substring(6);
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');

    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const isValid = validateCredentials(authHeader);

  if (!isValid) {
    const isApiRoute = request.nextUrl.pathname.startsWith('/api/admin');

    if (isApiRoute) {
      // API routes: return JSON error
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    } else {
      // Page routes: trigger browser login prompt
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }

  // Valid credentials: allow request
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};