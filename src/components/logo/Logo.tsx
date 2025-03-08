type LogoProps = {
  onClick?: () => void;
}

export default function Logo({ onClick }: LogoProps) {
    return (
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onClick}>
        <span className="text-green-600 font-bold text-xl hover:text-green-700">ShareBooks</span>
      </div>
    )
}