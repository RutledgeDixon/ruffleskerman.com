interface attributionProps {
    description: string;
    href: string;
    creditText: string;
}

export default function attribution({description, href, creditText}: attributionProps) {
    //component at the bottom of the page giving credit, maybe links, etc.
    return (
        <div className="attribution-container">
            <div className="attribution-description">
                {description}
            </div>
            <p className="attribution-links">
                {new Date().getFullYear()} Ruffles Kerman.  |  
                <a href="/privacy">Privacy Policy</a>  |  
                <a href="/terms">Terms of Service</a>
            </p>
        </div>
    );
}