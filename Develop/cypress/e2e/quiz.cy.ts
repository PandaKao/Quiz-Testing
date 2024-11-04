const mockQuestions = [
    {
        "question": "What is 1 + 1?",
        "answers": [
            { "text": "1", "isCorrect": false },
            { "text": "2", "isCorrect": true },
            { "text": "3", "isCorrect": false },
            { "text": "4", "isCorrect": false },
        ]
    },
    {
        "question": "What is 2 + 2?",
        "answers": [
            { "text": "1", "isCorrect": false },
            { "text": "2", "isCorrect": false },
            { "text": "3", "isCorrect": false },
            { "text": "4", "isCorrect": true },
        ]
    },
    {
        "question": "What is 1 + 5?",
        "answers": [
            { "text": "1", "isCorrect": false },
            { "text": "6", "isCorrect": true },
            { "text": "3", "isCorrect": false },
            { "text": "4", "isCorrect": false },
        ]
    },
]

describe('Python Quiz', () => {
    context('Quiz Testing', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', {
                statusCode: 200,
                delay: 1000,
                body: mockQuestions,
            }).as('getQuestions');

            cy.visit('/');
        });

        it('should allow a user to start a quiz and when the questions are all answered correctly it should return a score of 3/3. It should also retry the quiz leading back to the first question', () => {
            // starts the quiz
            cy.get('[data-cy="start"]').click();

            // tests loading
            cy.get('[data-cy="loading"]', { timeout: 2000 }).should('be.visible');
            cy.wait('@getQuestions');
            cy.get('.spinner-border').should('not.exist');

            // answers the first question correctly
            cy.contains("What is 1 + 1?").should('be.visible');
            cy.contains('[data-cy="answer"]', '2').click();

            // answers the second question correctly
            cy.contains("What is 2 + 2?").should('be.visible');
            cy.contains('[data-cy="answer"]', '4').click();

            // answers the third question correctly
            cy.contains("What is 1 + 5?").should('be.visible');
            cy.contains('[data-cy="answer"]', '2').click();

            // quiz complete with score and button for new quiz showing
            cy.get('h2').should('contain.text', 'Quiz Completed');
            cy.get('.alert.alert-success').should('contain.text', 'Your score: 3/3');
            cy.get('[data-cy=newQuiz]').should('contain.text', 'Take New Quiz');

            // clicks the take new quiz button and should show start quiz
            cy.get('[data-cy=newQuiz]').click();
            cy.contains("What is 1 + 1?").should('be.visible');

        });

        it('should allow the user to start a quiz and when all the questions are answered incorrectly it should return a score of 0/3. It should also retry the quiz leading back to the first question', () => {
            // starts the quiz
            cy.get('[data-cy="start"]').click();

            // tests loading
            cy.get('[data-cy="loading"]', { timeout: 2000 }).should('be.visible');
            cy.wait('@getQuestions');
            cy.get('.spinner-border').should('not.exist');

            // answers the first question incorrectly
            cy.contains("What is 1 + 1?").should('be.visible');
            cy.contains('[data-cy="answer"]', '1').click();

            // answers the second question incorrectly
            cy.contains("What is 2 + 2?").should('be.visible');
            cy.contains('[data-cy="answer"]', '1').click();

            // answers the third question incorrectly
            cy.contains("What is 1 + 5?").should('be.visible');
            cy.contains('[data-cy="answer"]', '1').click();

            // quiz complete with score and button for new quiz showing
            cy.get('h2').should('contain.text', 'Quiz Completed');
            cy.get('.alert.alert-success').should('contain.text', 'Your score: 0/3');
            cy.get('[data-cy=newQuiz]').should('contain.text', 'Take New Quiz');

            // clicks the take new quiz button and should show start quiz
            cy.get('[data-cy=newQuiz]').click();
            cy.contains("What is 1 + 1?").should('be.visible');
        });
    });
});