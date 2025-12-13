import * as React from "react";

function scorePassword(pw: string) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (pw.length >= 12) score += 1;
  return score; // 0..5
}

export function PasswordMeter({ password }: { password: string }) {
  const score = scorePassword(password);
  const percent = Math.round((score / 5) * 100);
  const color =
    score <= 1 ? "bg-rose-400" : score === 2 ? "bg-amber-400" : score === 3 ? "bg-amber-300" : score === 4 ? "bg-emerald-400" : "bg-emerald-600";

  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-2 ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{password ? `${percent}% strength` : "Enter a password"}</p>
    </div>
  );
}

export default PasswordMeter;
