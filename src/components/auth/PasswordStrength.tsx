interface PasswordStrengthProps {
  password: string;
}

function getScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-zA-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const score = getScore(password);

  const label = score <= 1 ? "Weak" : score <= 3 ? "Fair" : "Strong";
  const color = score <= 1 ? "bg-red-500" : score <= 3 ? "bg-amber-500" : "bg-green-500";
  const textColor =
    score <= 1 ? "text-red-600" : score <= 3 ? "text-amber-600" : "text-green-600";

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < Math.ceil(score * (3 / 4)) ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${textColor}`}>{label}</p>
    </div>
  );
}
