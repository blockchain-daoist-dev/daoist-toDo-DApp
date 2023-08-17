import styles from '../../styles/Todo.module.css'
import NoteItem from './NoteItem'

const NoteList = ({ todos, action }) => {
    return (
        <ul className={styles.todoList}>
            {todos.map((todo) => (
                <NoteItem key={todo.account.idx} {...todo.account} publicKey={todo.publicKey} action={action} />
            ))}
        </ul>
    )
}

export default NoteList
