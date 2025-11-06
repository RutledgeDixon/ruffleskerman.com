import { Button } from "@/components/ui/button";

interface categoryCardProps {
    title: string;
    description: string;
    progress: number; //1-100, only used for category card
    showCards: boolean;
    toggleShowCards: () => void;
}

export default function CategoryCard({title, description, progress, showCards, toggleShowCards}: categoryCardProps) {


    return (
        <div className="category-card" onClick={toggleShowCards}>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            {/* <p>{description}</p> */}
            <progress value={progress} max="100"></progress>
            {/* <div className="mt-6 text-center">
                <Button variant="letu" className="px-8 py-3 text-lg" onClick={toggleShowCards}>
                    {showCards ? 'Hide' : 'Show'}
                </Button>
            </div> */}
        </div>
    );
}