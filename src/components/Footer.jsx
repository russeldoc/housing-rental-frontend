const Footer = () => {
    return (
        <footer className="footer footer-center bg-base-200 text-base-content p-6 mt-10">

            <aside>

                <p className="font-bold text-lg">
                    HomeRent
                </p>

                <p>
                    Find a comfortable place to call home.
                </p>

                <p>
                    © {new Date().getFullYear()} HomeRent. All rights reserved.
                </p>

            </aside>

        </footer>
    );
};

export default Footer;