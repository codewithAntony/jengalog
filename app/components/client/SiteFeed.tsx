import React from "react";
import { Calendar, Camera, CheckCircle2 } from "lucide-react";

interface ProgressUpdate {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url: string;
  milestone_reached: boolean;
}

interface SiteFeedProps {
  updates: ProgressUpdate[];
}

const SiteFeed: React.FC<SiteFeedProps> = ({ updates }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-8 text-slate-800">
        Project Timeline
      </h2>
      <div className="relative border-l-2 border-blue-100 ml-3 space-y-10">
        {updates.map((update) => (
          <div key={update.id} className="relative pl-8">
            <div
              className={`absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white ${
                update.milestone_reached ? "bg-green-500" : "bg-blue-500"
              }`}
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-hover hover:shadow-md">
              <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={16} />
                  {new Date(update.created_at).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                {update.milestone_reached && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Milestone
                  </span>
                )}
              </div>

              {update.image_url && (
                <img
                  src={update.image_url}
                  alt={update.title}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {update.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {update.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteFeed;
