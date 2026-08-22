import { Button } from "@/components/ui/button";

export default function ProjectCard({ title, description, href, buttonText }) {
    return (
        <div className="site-card flex flex-col p-7">
            <h3 className="text-xl font-semibold mb-2 tracking-tight text-slate-50">{title}</h3>
            <p className="text-slate-300/80 leading-relaxed flex-1">{description}</p>
            <div className="mt-6 text-center">
                <a
                    href={href}
                    className="inline-block"
                >
                    <Button variant="letu" className="px-8 py-3 text-lg">
                        {buttonText}
                    </Button>
                </a>
            </div>
        </div>
    );
}
