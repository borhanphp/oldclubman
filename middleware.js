import { NextResponse } from 'next/server';

export function middleware(req) {
    // Get the token and explicitly check if it exists
    const token = req.cookies.get('old_token')?.value || "";
    const hasValidToken = token !== undefined && token !== null && token !== "";
    const url = req.nextUrl.clone();
    const authPages = url.pathname === '/auth/login' || url.pathname === '/auth/register';
    
    // Handle root path - redirect to login if no valid token
    if (url.pathname === '/' && !hasValidToken) {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    if (url.pathname === '/' && hasValidToken) {
        url.pathname = '/user/gathering';
        return NextResponse.redirect(url);
    }
    
    // Handle protected routes - redirect to login if no valid token
    if (!hasValidToken && !authPages) {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    // Handle auth pages when logged in - redirect to dashboard
    if (hasValidToken && authPages) {
        url.pathname = '/user/gathering';
        return NextResponse.redirect(url);
    }

    // if(url.pathname === '/'){
    //     return NextResponse.redirect(`${origin}`);
    // }
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/user/:path*', '/auth/login', '/auth/register'],
};

