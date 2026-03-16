import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout
            title="Registration disabled"
            description="New public accounts are currently not available for this application"
        >
            <Head title="Register" />
            <div className="space-y-6 text-sm text-muted-foreground">
                <p>
                    Admin access seed ke through available hai. Public users ke liye self-signup off rakha gaya hai.
                </p>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()} tabIndex={1}>
                        Log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
