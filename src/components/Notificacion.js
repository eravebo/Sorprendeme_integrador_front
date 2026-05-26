export default function Notificacion({ mensaje, visible }) {
  if (!visible) return null;
  return <div className="notificacion">{mensaje}</div>;
}
