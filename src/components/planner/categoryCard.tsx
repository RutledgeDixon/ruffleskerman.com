import { Button } from "@/components/ui/button";

interface categoryCardProps {
    title: string;
    description: string;
    progress: number; //1-100, only used for category card
    showCards: boolean;
    toggleShowCards: () => void;
    selected: boolean;
}

export default function CategoryCard({title, description, progress, showCards, toggleShowCards, selected}: categoryCardProps) {

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