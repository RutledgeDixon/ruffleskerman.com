

interface categoryCardProps {
    category: string;
    description: string;
    progress: number; //1-100, only used for category card
}

export default function CategoryCard({category, description, progress}: categoryCardProps) {

    return (
        <div>
            <h2>{category}</h2>
            <p>{description}</p>
            <progress value={progress} max="100"></progress>
        </div>
    );
}