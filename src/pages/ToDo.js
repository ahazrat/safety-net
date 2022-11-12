export default function ToDo(props) {
  return (
    <div style={{ backgroundColor: '#778', padding: 30 }}>
        <h1>To Do</h1>

      <div style={{ width: 300, margin: 'auto', textAlign: 'left' }}>
        <ol>
          <li>Calculator sidebar</li>
          <li>CalculatorHW</li>
          <li>better styles</li>
          <li>nopage design</li>
        </ol>

        <h2>Done</h2>
        <ul>
          <li>update Calculator defaults</li>
          <li>organize calculator variables</li>
          <li>services definitions</li>
          <li>add calculator detail</li>
          <li>better services display</li>
          <li>value calculator</li>
          <li>nav layout drawer</li>
          <li>react router</li>
        </ul>
      </div>

    </div>
  )
}
