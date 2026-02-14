import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { cdnUrl } = usePage().props;
    const bgImage = cdnUrl ? `${cdnUrl}/landing/background.jpeg` : null;

    return (
        <div className="relative flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            {/* Background image from CDN */}
            {bgImage && (
                <div
                    className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
            )}
            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="relative z-10 mt-6 w-full overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 shadow-2xl sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
