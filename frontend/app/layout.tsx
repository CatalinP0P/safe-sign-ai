export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0,
        }}
      >
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <strong>SafeSign AI</strong>
        </nav>

        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>

        <footer
          style={{
            padding: '1rem',
            fontSize: '0.8rem',
            color: '#666',
            borderTop: '1px solid #eee',
          }}
        >
          © 2026 SafeSign AI - Protecția Inteligentă a Semnatarului
        </footer>
      </body>
    </html>
  );
}
