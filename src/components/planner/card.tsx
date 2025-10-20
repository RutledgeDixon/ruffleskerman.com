

interface cardProps {
    title: string;
    description: string;
    answer: string;
    imageurl: string;
    category: string;
    checked: boolean;
}

export default function Card({title, description, answer, imageurl, category, checked}: cardProps) {

    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{answer}</p>
            <img src={imageurl} alt={title} />
            <input type="checkbox" checked={checked} />
        </div>
    );
}