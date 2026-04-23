import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse(
      "ADMIN_PASSWORD is not set. Add it to .env.local and restart the server.",
      { status: 500 },
    );
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const encoded = header.slice(6);
      const decoded = atob(encoded);
      const sep = decoded.indexOf(":");
      const password = sep === -1 ? decoded : decoded.slice(sep + 1);
      if (password === expected) return NextResponse.next();
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="TACTUS Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
