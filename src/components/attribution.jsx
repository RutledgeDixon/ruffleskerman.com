export default function Attribution({ description, creditText }) {
    // Component at the bottom of the page giving credit, maybe links, etc.
    return (
        <div className="attribution-container">
            <div className="attribution-description">
                {description}
            </div>
            <div className="attribution-credit">
                Credit: {creditText}
            </div>
            <p className="attribution-links">
                {new Date().getFullYear()} Ruffles Kerman.  |  
                <a href="/no">Don't click</a>  |  
                <a href="/no1">Don't click this either</a>
            </p>
        </div>
    );
}
