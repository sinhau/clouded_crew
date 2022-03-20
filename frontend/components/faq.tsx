import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  ListItem,
  OrderedList,
  Flex,
  Grid,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";

export default function FAQ() {

  const AnswerText = ({ children }) => (
    <Text
      flex={1}
      fontWeight="600"
      fontStyle="normal"
      fontSize="1rem"
      lineHeight="1.5rem"
      mt="1rem"
    >
      {children}
    </Text>
  );

  const QuestionText = ({children}) => (
    <Flex marginY="1rem" w="full" justify="space-between">
      <Heading textAlign="left" fontSize="1.25rem" fontWeight="900">
        {children}
      </Heading>
      <AccordionIcon />
    </Flex>
  );

  return (
    <Grid
      gridTemplateColumns="1fr"
      w={{  base: "90%", lg: "70%" }}
      gap="1rem"
      mt={"6rem"}
    >
      <Heading textAlign="center">
      Clouded Crew FAQ
      </Heading>
      <Accordion allowMultiple allowToggle>
        {FrequentlyAskedQuestions.map((faq, index) => (
          <AccordionItem border="none" key={index}>
            <AccordionButton _focus={{ borderSize: "0px", border: "none" }}>
              <QuestionText>{faq.question}</QuestionText>
            </AccordionButton>
            <AccordionPanel mt={-4}>
              <AnswerText>{faq.answer}</AnswerText>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Grid>
  );
}

export const FrequentlyAskedQuestions = [
  {
    question: "What is Clouded Crew?",
    answer: (
      <Text textAlign="left">
Clouded Crew is a collection of 3,333, 3D-rendered cloud PFP NFT’s on the Ethereum blockchain.         </Text>
    ),
  },
  {
    question: "Why was the Clouded Crew started?",
    answer: (
      <Text textAlign="left">
I started this project bc in my childhood I lived in my head. During class I always found myself daydreaming about something, my head was always in the clouds. We want to give back to the next generation of creatives, and allow people to dream, wander, and believe - that is the mission.
        </Text>
    ),
  },
  {
    question: "How many Crew Members?",
    answer: (
      <Text textAlign="left">
      There will be 3,333 in total with 333 of them going to WL collaborations.
      *333 will be held for the project wallet
      </Text>
    ),
  },
  {
    question: "What is the mint price?",
    answer: (
      <Text textAlign="left">
          All WL mints {"(333)"} will be FREE + Gas. Remaining will be 0.0333 ETH. It was important to us to make this collection on the cheaper side, with seeing many cash grabby looking projects in the market at the moment.
        </Text>
    ),
  },
  {
    question: "Is there a mint limit?",
    answer: (
      <Text textAlign="left">
          Yes, the maximum limit to mint per wallet during the WL sale will be 1 and 3 for public sale.
        </Text>
    ),
  },
  {
    question: "Wen mint?",
    answer: (
      <Text textAlign="left">
          TBD
        </Text>
    ),
  },
  {
    question: "Which charity will the money be donated to?",
    answer: (
        <Text textAlign="left">
          The final charity will be chosen by the Clouded Council, royalty donations will be donated on a month to month/quarterly basis
        </Text>
    ),
  },
  {
    question: "What is the roadmap?",
    answer: (
      <OrderedList spacing="0.875rem">
        <ListItem>
        Project collaborations and WL giveaways
        </ListItem>
        <ListItem>
        Mint day
        </ListItem>
        <ListItem>
        Establish the Clouded Council
        </ListItem>
        <ListItem>
        Host community events
        </ListItem>
        <ListItem>
        Onboard and grant our first creative
        </ListItem>
      </OrderedList>
    ),
  },
  {
    question: "What is the utility?",
    answer: (
      <VStack alignItems="left" gap="0.875rem">
        <Text>
          The utility behind Clouded Crew lies in the grants that we give to the creatives decided on by the Clouded Council. In return for funding by the treasury, the creative will guarantee WL spots for the community among other perks.
        </Text>
      </VStack>
    ),
  },
];
