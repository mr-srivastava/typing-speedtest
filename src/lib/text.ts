/**
 * Returns a randomly selected text from a predefined list of texts.
 *
 * @return {string} A randomly selected text from the list.
 * @throws {Error} If the `texts` array is empty or undefined.
 */
export default function getText() {
  const texts = [
    "Here's to the crazy ones. The misfits. The rebels. The troublemakers." +
      " The round pegs in the square holes. The ones who see things differently." +
      " They're not fond of rules. And they have no respect for the status quo." +
      " You can quote them, disagree with them, glorify or vilify them. About the only thing" +
      " you can't do is ignore them. Because they change things. They push the human race forward. And" +
      " while some may see them as the crazy ones, we see genius. Because the people who are crazy" +
      " enough to think they can change the world, are the ones who do.",

    "I believe that everything happens for a reason. People change so that you can learn to let go," +
      " things go wrong so that you appreciate them when they're right, you believe lies so you eventually" +
      " learn to trust no one but yourself, and sometimes" +
      " good things fall apart so better things can fall together.",

    "To love at all is to be vulnerable. Love anything and your heart will be wrung and possibly broken. If" +
      " you want to make sure of keeping it intact you must give it to no one, not even an animal." +
      " Wrap it carefully round with hobbies and little luxuries; avoid all entanglements. Lock it up safe" +
      " in the casket or coffin of your selfishness. But in that casket, safe, dark, motionless, airless" +
      " will change. It will not be broken; it will become unbreakable, impenetrable, irredeemable." +
      " To love is to be vulnerable",

    "Success is not final, failure is not fatal: It is the courage to continue that counts." +
      " This quote reminds us that achieving success or encountering failure are not the end states." +
      " It is the determination to keep moving forward despite the ups and downs that truly matters." +
      " Persistence, resilience, and the willingness to keep trying are key factors in the journey to success.",

    "Life is what happens when you're busy making other plans." +
      " This saying emphasizes the importance of living in the present and enjoying the moments as they come." +
      " While it's good to have plans and goals, it's equally important to appreciate the here and now." +
      " Often, the best experiences and memories are those that occur unexpectedly.",

    "The only way to do great work is to love what you do." +
      " Passion is a crucial element in achieving excellence in any field." +
      " When you love what you do, it doesn't feel like work, and you are more likely to put in the effort" +
      " and dedication needed to excel. Finding something you are passionate about can lead to greater" +
      " satisfaction and success in your career and personal life.",

    "In the end, we will remember not the words of our enemies, but the silence of our friends." +
      " This quote highlights the importance of support and solidarity in times of adversity." +
      " The actions and inactions of those we consider friends can have a profound impact on us." +
      " It is a reminder to stand up for others and be present for the people we care about," +
      " especially in difficult times.",

    "The greatest glory in living lies not in never falling, but in rising every time we fall." +
      " This quote by Nelson Mandela underscores the value of resilience and the ability to recover" +
      " from setbacks. Everyone faces challenges and failures, but true strength and glory come" +
      " from getting back up and continuing to strive for our goals despite the difficulties.",
  ];

  if (!texts || texts.length === 0) {
    throw new Error("The `texts` array is empty or undefined.");
  }

  return texts[Math.floor(Math.random() * texts.length)];
}
