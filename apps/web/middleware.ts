import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')
    const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'
    
    // If no token, redirect to login unless already on login or signup page
    if (!token) {
        if (!isAuthRoute) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    } 
    
    // If there is a token, verify it
    try {
        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET_KEY!))
        
        // If token is valid and user is trying to access login/signup pages, redirect to home
        if (isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        
        // For other routes, proceed with the authenticated user
        const headers = new Headers(request.headers)
        headers.set("x-userEmail", Object(payload).email)
        return NextResponse.next({
            headers: headers
        })
    } catch (error) {
        // If token verification fails, clear the invalid token and redirect to login
        console.error(error)
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
    }
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
}