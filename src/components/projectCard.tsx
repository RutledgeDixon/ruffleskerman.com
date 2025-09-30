import { Button } from "@/components/ui/button";

interface ProjectCardProps {
    title: string;
    description: string;
    href: string;
    buttonText: string;
}

export default function ProjectCard({ title, description, href, buttonText }: ProjectCardProps) {
    return (
        <div className="bg-green-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-400">{description}</p>
            <div className="mt-6 text-center">
                <a
                    href={href}
                    className="inline-block"
                >
                    <Button variant="letu" className="px-8 py-3 text-lg"
                        >{buttonText}</Button
                    >
                </a>
            </div>
        </div>
    );
}