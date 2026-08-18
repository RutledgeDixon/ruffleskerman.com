// Shared by the planner's category list and the movie polls' movie list —
// both just show a title and a progress bar.
export default function ProgressCard({ title, progress, selected, toggleShowCards }) {
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
