interface SheetConfigProps {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

export default function SheetConfig({ width, height, onChange }: SheetConfigProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
      <h2>Configuração da Chapa (mm)</h2>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Largura (X):</label>
          <input
            type="number"
            min="1"
            value={width || ''}
            onChange={(e) => onChange(Number(e.target.value), height)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #999' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Altura (Y):</label>
          <input
            type="number"
            min="1"
            value={height || ''}
            onChange={(e) => onChange(width, Number(e.target.value))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #999' }}
          />
        </div>
      </div>
    </div>
  );
}