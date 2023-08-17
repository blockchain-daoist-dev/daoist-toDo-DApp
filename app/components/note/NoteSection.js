import styles from '../../styles/Todo.module.css'
import NoteList from './NoteList'

const NoteSection = ({ title, todos, action }) => {
    return (
        <div className={styles.todoSection}>
            <h1 className="title">
                {title} - {todos.length}
            </h1>

            <NoteList todos={todos} action={action} />
        </div>
    )
}

export default NoteSection
