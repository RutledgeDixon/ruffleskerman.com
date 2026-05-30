import { Button } from "@/components/ui/button";

export default function CategoryCard({title, description, progress, showCards, toggleShowCards, selected}) {
    return (
        <div
            className={`category-card${selected ? ' selected' : ''}`}
            onClick={toggleShowCards}
        >
            <h3 className="text-xl font-semibold mb-3" style={{marginBottom: '8px'}}>{title}</h3>
            <progress value={progress} max="100" style={{width: '100%', height: '8px', marginBottom: '8px'}}></progress>
        </div>
    );
}
