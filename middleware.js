import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('old_token')?.value || "";
    const url = req.nextUrl.clone();
    const origin = req.nextUrl.origin
    const authPages = url.pathname === '/auth/login' || url.pathname === '/auth/register';
    console.log('middleware',token)
    if (url.pathname === '/' && !token) {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    if (!token && !authPages) {
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    if (token && authPages) {
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

