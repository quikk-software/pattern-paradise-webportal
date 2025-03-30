export default function PaymentDivider() {
  return (
    <div className="relative flex items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink text-sm text-gray-500">or</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
