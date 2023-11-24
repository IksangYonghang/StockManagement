import "./home.scss";
import wallpic from "../../images/wallpic.png";
import { useContext } from "react";
import { ThemeContext } from "../../context/theme.context";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="content home">
      <h1
        style={{ textAlign: "center", color: darkMode ? "#09ee70" : "#062442" }}
      >
        STOCK MANAGEMENT SYSTEM
      </h1>
      <img
        src={wallpic}
        alt="wallpic"
        style={{
          display: "block",
          width: "40%",
          height: "auto",
          marginBottom: "20px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10px",
        }}
      />

      <span>
        <h3> Background and Introduction </h3>
        <br />
        <p>
          Management problems involve decision making problems. Decisions are
          important tasks that all companies have to make. The premise that
          companies have to acquire, allocate, and control factors of production
          brings out the necessity for inventory management. Companies involve
          themselves in inventory management in order to hold inventories at
          lowest possible costs given their own objectives. This ensures that
          the company runs well as expected and thus reaching to a compromise
          between the different costs involved becomes a must. According to
          Mpwanya (2006), “Inventory control is the activity which organizes the
          availability of items to the customers as it coordinates the
          purchasing, manufacturing and distribution functions to meet the
          marketing needs”(11). Thus, the control factor brings in the
          management aspect.
        </p>
        <br></br>
        <br></br>
        <p>
          Inventories have been defined as the taking of stock for raw
          materials, supplier components, and work in progress and even finished
          goods that appear at various points of production and logistics
          channel (Mpwanya, 2006). There exists the pros and cons of inventory
          as it is worthy noting that holding too much of inventory usually puts
          the company in a challenging situation on warehousing space and cost
          management affecting the company profits. However, holding too little
          of it results in delayed deliveries and compromised customer service
          and this is neither a good situation for any company with an aim of
          succeeding.
        </p>
        <br></br>
        <br></br>
        <p>
          Adeyemi and Salami (2010) defines inventory management as the art of
          keeping the most economical amount of a particular kind of a good or
          any product in order to facilitate an increase in the total value of
          all the assets the company owns. It informs the managers of how much
          of a good to re-order when to re-order and how frequent it should be
          done. Inventory management thus helps in making sound business
          decisions depending on the motives of holding the inventories. These
          motives can be transactional, precaution or speculative in nature. For
          example, a company can decide to hold stock to meet production or
          sales goals as well as to cover the possibility that underestimations
          might take place in future, it can also hold stock if there is a
          possibility of gaining more in the future thus holding more of the
          stock. Several scholars have summarized the advantages of inventory
          management as follows: helping companies achieve economies of scale;
          companies can realize economies of scales in their activities whether
          in manufacturing, purchasing or transportation by simply holding their
          inventories. For example, if the company is able to buy at large
          scales, there is a possibility for it being given large discounts in
          the return, the company’s transport facilities will be used to
          transport large volumes of goods and thus achieve economies of scale
          by better utilization of its equipments.
        </p>
        <br />
        <br />
        <p>
          In the manufacturing sector, economies of scale can be achieved by
          ordering more material and thus production takes longer and this
          allows for reduced fixed cost of production per unit. Inventory
          management also helps companies in achieving balance of trade: this
          can be explained using an example where some companies accumulate
          inventory to take advantage of seasonal demand. For instance, a
          company which makes ice creams may see some demand all year but most
          of its sales will increase during the hot seasons especially during
          the summer. Thus, inventory management will help the company in
          producing to stock. This helps the company in establishing a stable
          work force and keeping the operating costs down. Inventory management
          also helps in specialization. Firms with subsidiaries are allowed to
          specialize, for example, instead of manufacturing variety of products
          each plant can manufacture a product and then distribute it to the
          customers or to storage places and in this case economies of scale are
          achieved through long run production. The process of inventory
          management is also known to protect the company from uncertainties as
          it offsets demand and supply uncertainties.For example, if the demand
          increases and the stocks run out, the production line may be shut
          until more materials are gathered and delivered. Likewise a shortage
          of workforce would mean that production process cannot be completed.
          The last advantage of inventory management is the fact that it acts as
          a buffer interface (Stock& Lambert, 2000). It does this through
          creation of both place and time utilities. These interfaces include
          among others: supplier and purchasing and marketing and distribution.
          We can thus say that inventory management: “Represent the largest
          single investment in assets for most manufacturers, wholesales, and
          retailers” (Stock& Lambert, 2000: 188).
        </p>
        <br />
        <br />
        <h3>
          Ideas to Improve the Inventory Management and How As A Manager I Can
          Make Inventory Management Better
        </h3>
        <br />
        <p>
          In order to improve the inventory management several ways exist and
          they include:- Commitment of company management: the fact that lower
          inventories have different impacts on the company system; it should be
          the role of the company to ensure that the activities taking part in
          the company are all geared towards meeting the customer needs and
          without excess stocks being left unused. The other way through which
          inventory management can be improved is through analysis of all the
          inventory items involved. It is important for the company management
          to understand that goods in the inventory are important according to
          their contribution towards achieving the company objectives. The items
          which generate more profits should be classified in a different class
          from the others and they should be maintained at a higher percentage
          compared to those which have lower return rates. They can also be
          classified according to their bulkiness in order to be aware of the
          transport logistics likely to be involved. Another way of improving
          inventory management is by assuring that there is improved performance
          of all the logistic activities. Activities such as the warehousing,
          transport, and order processing can derail the benefits of inventory
          management and thus the need to ensuring that they are all working
          properly. As the company manager, I can also improve the inventory
          management by using better and improved demand forecasting methods.
          Better demand forecasting reduces variability in terms of the expected
          against the actual sales. Improving inventory management can also be
          done through the use of inventory management software. In the recent
          past, there have been creation of software that seeks to solve all
          sorts of problems and inventory management has not been left behind
          either. By managers using this software, they are able to predict
          easily the fast moving inventories as well as the more profitable
          items in the company. Finally, the use of postponement methods is
          another way of improving inventory management. This process involves
          modifying or customizing products after the main manufacturing process
          has been completed then delay the configuration and distribution
          process to the time when the distribution cycle will be favorable.
        </p>
        <br />
        <br />
        <h3>Conclusion</h3>
        <br />
        <p>
          We can conclude that inventory management is an important effective
          management tool for a company as it helps in the control of materials
          or goods, which have to be held for later use with its principal goal
          being to keep the balance of the conflict economics of keeping or not
          keeping too much of an item or stock. It does this through the
          classification and characterization of all the assets or policies
          within a company.
        </p>
      </span>
    </div>
  );
};

export default Home;
